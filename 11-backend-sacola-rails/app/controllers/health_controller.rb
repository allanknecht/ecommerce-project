class HealthController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    render json: { status: "ok", timestamp: Time.current.iso8601 }
  end
end
