require_relative "boot"
require "rails/all"
Bundler.require(*Rails.groups)

module ChatgptTodo
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.time_zone = "Baghdad"
    config.active_record.default_timezone = :utc
    config.hosts.clear
  end
end
