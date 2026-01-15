class HealthController < ActionController::API
  def index
    render json: {
      status: "ok",
      time: Time.current.iso8601
    }
  end
end

