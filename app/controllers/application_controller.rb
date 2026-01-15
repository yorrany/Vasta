class ApplicationController < ActionController::API
  before_action :set_current_tenant

  private

  def set_current_tenant
    slug = request.headers["X-Tenant-Slug"]
    tenant = Tenant.find_by(slug: slug)
    if tenant.nil?
      render json: { error: "Tenant not found" }, status: :not_found
    else
      Current.tenant = tenant
    end
  end
end

