class ApplicationController < ActionController::API
  before_action :authenticate_assistant!

  private

  def authenticate_assistant!
    expected = ENV["ASSISTANT_API_KEY"].to_s
    provided = request.authorization.to_s.sub(/\ABearer\s+/i, "")

    if expected.empty? || provided.empty? || !ActiveSupport::SecurityUtils.secure_compare(provided, expected)
      render json: { error: "unauthorized" }, status: :unauthorized
    end
  end
end
