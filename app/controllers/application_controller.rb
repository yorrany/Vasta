class ApplicationController < ActionController::API
  before_action :set_current_tenant
  before_action :ensure_tenant_active

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

  def ensure_tenant_active
    return unless Current.tenant

    if Current.tenant.billing_status == "blocked"
      render json: { error: "Tenant blocked due to unpaid subscription" }, status: :payment_required
    end
  end
end

