<?php
/**
 * Plugin Name: SEC Headless Content Model
 * Description: Registers SEC headless WordPress content model: CPTs, taxonomies, REST-exposed fields, and careers toggle setting.
 * Version: 1.0.0
 * Author: Superior Digital
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Sec_Headless_Content_Model
{
    private const PROJECT_META_FIELDS = [
        'location' => ['type' => 'string'],
        'completion_date' => ['type' => 'string'],
        'featured' => ['type' => 'boolean'],
        'square_footage' => ['type' => 'number'],
        'description' => ['type' => 'string'],
        'hero_image' => ['type' => 'string'],
        'gallery_images' => ['type' => 'array', 'items' => ['type' => 'string']],
        'services' => ['type' => 'array', 'items' => ['type' => 'string']],
        'related_projects' => ['type' => 'array', 'items' => ['type' => 'integer']],
    ];

    private const TEAM_META_FIELDS = [
        'job_title' => ['type' => 'string'],
        'credentials' => ['type' => 'array', 'items' => ['type' => 'string']],
        'email' => ['type' => 'string'],
        'bio' => ['type' => 'string'],
        'years_with_company' => ['type' => 'integer'],
        'notable_projects' => ['type' => 'array', 'items' => ['type' => 'string']],
        'linkedin_url' => ['type' => 'string'],
        'headshot_image' => ['type' => 'string'],
    ];

    private const SERVICE_META_FIELDS = [
        'summary' => ['type' => 'string'],
        'capabilities' => ['type' => 'array', 'items' => ['type' => 'string']],
        'certifications' => ['type' => 'array', 'items' => ['type' => 'string']],
        'related_projects' => ['type' => 'array', 'items' => ['type' => 'integer']],
    ];

    public static function bootstrap(): void
    {
        add_action('init', [self::class, 'register_content_types']);
        add_action('init', [self::class, 'register_meta_fields']);
        add_action('rest_api_init', [self::class, 'register_rest_fields']);
        add_action('rest_api_init', [self::class, 'register_settings_routes']);
        add_action('admin_init', [self::class, 'register_careers_setting']);
    }

    public static function register_content_types(): void
    {
        register_post_type('projects', [
            'label' => 'Projects',
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'projects',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
            'menu_icon' => 'dashicons-building',
            'has_archive' => true,
        ]);

        register_post_type('team_members', [
            'label' => 'Team Members',
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'team-members',
            'supports' => ['title', 'editor', 'thumbnail', 'revisions'],
            'menu_icon' => 'dashicons-groups',
            'has_archive' => false,
        ]);

        register_post_type('services', [
            'label' => 'Services',
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'services',
            'supports' => ['title', 'editor', 'excerpt', 'revisions'],
            'menu_icon' => 'dashicons-admin-tools',
            'has_archive' => false,
        ]);

        register_taxonomy('project_category', ['projects'], [
            'label' => 'Project Categories',
            'public' => true,
            'show_admin_column' => true,
            'show_in_rest' => true,
            'rest_base' => 'project-categories',
            'hierarchical' => true,
        ]);

        register_taxonomy('service_type', ['services'], [
            'label' => 'Service Types',
            'public' => true,
            'show_admin_column' => true,
            'show_in_rest' => true,
            'rest_base' => 'service-types',
            'hierarchical' => true,
        ]);
    }

    public static function register_meta_fields(): void
    {
        self::register_post_type_meta('projects', self::PROJECT_META_FIELDS);
        self::register_post_type_meta('team_members', self::TEAM_META_FIELDS);
        self::register_post_type_meta('services', self::SERVICE_META_FIELDS);
    }

    public static function register_rest_fields(): void
    {
        register_rest_field('projects', 'category', [
            'get_callback' => static function (array $object): string {
                $terms = wp_get_post_terms((int) $object['id'], 'project_category');
                if (is_wp_error($terms) || empty($terms)) {
                    return '';
                }
                return (string) $terms[0]->slug;
            },
            'update_callback' => static function ($value, WP_Post $post): bool {
                if (!is_string($value) || $value === '') {
                    return true;
                }

                $term = term_exists($value, 'project_category');
                if ($term === 0 || $term === null) {
                    $created = wp_insert_term($value, 'project_category', ['slug' => sanitize_title($value)]);
                    if (is_wp_error($created)) {
                        return false;
                    }
                    $term_id = (int) $created['term_id'];
                } else {
                    $term_id = (int) (is_array($term) ? $term['term_id'] : $term);
                }

                $result = wp_set_post_terms($post->ID, [$term_id], 'project_category', false);
                return !is_wp_error($result);
            },
            'schema' => [
                'type' => 'string',
                'description' => 'Primary project category slug.',
                'context' => ['view', 'edit'],
            ],
        ]);

        self::register_acf_rest_field('projects', self::PROJECT_META_FIELDS);
        self::register_acf_rest_field('team_members', self::TEAM_META_FIELDS);
        self::register_acf_rest_field('services', self::SERVICE_META_FIELDS);
    }

    public static function register_settings_routes(): void
    {
        register_rest_route('sec/v1', '/settings/careers', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => static function (): WP_REST_Response {
                    $enabled = (bool) get_option('sec_careers_openings_enabled', false);
                    return rest_ensure_response([
                        'careers_openings_enabled' => $enabled,
                    ]);
                },
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => static function (WP_REST_Request $request): WP_REST_Response {
                    $value = (bool) $request->get_param('careers_openings_enabled');
                    update_option('sec_careers_openings_enabled', $value, false);

                    return rest_ensure_response([
                        'careers_openings_enabled' => (bool) get_option('sec_careers_openings_enabled', false),
                    ]);
                },
                'permission_callback' => static function (): bool {
                    return current_user_can('manage_options');
                },
                'args' => [
                    'careers_openings_enabled' => [
                        'type' => 'boolean',
                        'required' => true,
                    ],
                ],
            ],
        ]);
    }

    public static function register_careers_setting(): void
    {
        register_setting('general', 'sec_careers_openings_enabled', [
            'type' => 'boolean',
            'default' => false,
            'show_in_rest' => true,
            'sanitize_callback' => static function ($value): bool {
                return (bool) $value;
            },
        ]);

        add_settings_field(
            'sec_careers_openings_enabled',
            'Careers Openings Enabled',
            static function (): void {
                $value = (bool) get_option('sec_careers_openings_enabled', false);
                echo '<label for="sec_careers_openings_enabled">';
                echo '<input type="checkbox" id="sec_careers_openings_enabled" name="sec_careers_openings_enabled" value="1" ' . checked($value, true, false) . ' />';
                echo ' Show active job openings link/content';
                echo '</label>';
            },
            'general'
        );
    }

    private static function register_post_type_meta(string $post_type, array $fields): void
    {
        foreach ($fields as $field_name => $schema) {
            register_post_meta($post_type, $field_name, [
                'single' => true,
                'type' => $schema['type'] === 'number' ? 'number' : ($schema['type'] === 'integer' ? 'integer' : ($schema['type'] === 'boolean' ? 'boolean' : ($schema['type'] === 'array' ? 'string' : 'string'))),
                'show_in_rest' => [
                    'schema' => self::build_field_schema($field_name, $schema),
                ],
                'sanitize_callback' => static function ($value) use ($schema) {
                    return Sec_Headless_Content_Model::sanitize_meta_value($value, $schema);
                },
                'auth_callback' => static function (): bool {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }

    private static function register_acf_rest_field(string $post_type, array $fields): void
    {
        register_rest_field($post_type, 'acf', [
            'get_callback' => static function (array $object) use ($fields): array {
                $post_id = (int) $object['id'];
                $payload = [];
                foreach ($fields as $field_name => $schema) {
                    $raw = get_post_meta($post_id, $field_name, true);
                    $payload[$field_name] = Sec_Headless_Content_Model::hydrate_meta_value($raw, $schema);
                }
                return $payload;
            },
            'update_callback' => static function ($value, WP_Post $post) use ($fields): bool {
                if (!is_array($value)) {
                    return false;
                }

                foreach ($fields as $field_name => $schema) {
                    if (!array_key_exists($field_name, $value)) {
                        continue;
                    }

                    $sanitized = Sec_Headless_Content_Model::sanitize_meta_value($value[$field_name], $schema);
                    if ($schema['type'] === 'array') {
                        update_post_meta($post->ID, $field_name, wp_json_encode($sanitized));
                        continue;
                    }

                    update_post_meta($post->ID, $field_name, $sanitized);
                }

                return true;
            },
            'schema' => [
                'type' => 'object',
                'context' => ['view', 'edit'],
                'properties' => self::build_fields_schema($fields),
            ],
        ]);
    }

    private static function build_fields_schema(array $fields): array
    {
        $schema = [];
        foreach ($fields as $field_name => $definition) {
            $schema[$field_name] = self::build_field_schema($field_name, $definition);
        }
        return $schema;
    }

    private static function build_field_schema(string $field_name, array $definition): array
    {
        $schema = [
            'type' => $definition['type'],
            'context' => ['view', 'edit'],
        ];

        if ($definition['type'] === 'array' && isset($definition['items'])) {
            $schema['items'] = $definition['items'];
        }

        $schema['description'] = sprintf('SEC field: %s', $field_name);

        return $schema;
    }

    private static function sanitize_meta_value($value, array $schema)
    {
        switch ($schema['type']) {
            case 'boolean':
                return (bool) $value;
            case 'integer':
                return (int) $value;
            case 'number':
                return (float) $value;
            case 'array':
                if (!is_array($value)) {
                    return [];
                }
                $item_type = $schema['items']['type'] ?? 'string';
                $items = [];
                foreach ($value as $item) {
                    if ($item_type === 'integer') {
                        $items[] = (int) $item;
                    } else {
                        $items[] = sanitize_text_field((string) $item);
                    }
                }
                return $items;
            default:
                return sanitize_text_field((string) $value);
        }
    }

    private static function hydrate_meta_value($raw, array $schema)
    {
        if ($schema['type'] !== 'array') {
            return self::sanitize_meta_value($raw, $schema);
        }

        if (is_array($raw)) {
            return self::sanitize_meta_value($raw, $schema);
        }

        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return self::sanitize_meta_value($decoded, $schema);
            }
        }

        return [];
    }
}

Sec_Headless_Content_Model::bootstrap();
