Rails.application.routes.draw do
  get "/health", to: proc { [200, { "content-type" => "application/json" }, ['{"status":"ok"}']] }

  namespace :api do
    namespace :v1 do
      resources :tasks, only: %i[index show create update destroy] do
        member do
          post :complete
        end
      end
      get "brief/daily", to: "briefs#daily"
    end
  end
end
