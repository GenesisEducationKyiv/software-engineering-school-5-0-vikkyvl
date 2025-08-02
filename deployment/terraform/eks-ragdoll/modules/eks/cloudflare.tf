resource "random_id" "tunnel_secret" {
  count       = var.cloudflare_enable_tunnel ? 1 : 0
  byte_length = 32
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "eks_tunnel" {
  count      = var.cloudflare_enable_tunnel ? 1 : 0
  account_id = var.cloudflare_account_id
  name       = "eks-ragdoll-tunnel"
  secret     = random_id.tunnel_secret[0].b64_std
}

resource "cloudflare_record" "tunnel_cname" {
  count   = var.cloudflare_enable_tunnel ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_tunnel_hostname
  type    = "CNAME"
  content = cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel[0].cname
  ttl     = 1
  proxied = true
}

resource "helm_release" "cloudflared" {
  count      = var.cloudflare_enable_tunnel ? 1 : 0
  name       = "cloudflared"
  chart      = "./addons/cloudflare-tunnel-0.3.2.tgz"
  namespace  = "kube-system"

  set = [
    {
      name  = "cloudflare.tunnelName"
      value = cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel[0].name
    },
    {
      name  = "cloudflare.account"
      value = var.cloudflare_account_id
    },
    {
      name = "cloudflare.tunnelId"
      value = cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel[0].id
    },
    {
      name = "cloudflare.secret"
      value = random_id.tunnel_secret[0].b64_std
    },
    {
      name  = "cloudflare.enableWarp"
      value = "false"
    },
    {
      name  = "cloudflare.ingress[0].hostname"
      value = var.cloudflare_tunnel_hostname
    },
    {
      name  = "cloudflare.ingress[0].service"
      value = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local:80"
    },
  ]

    depends_on = [
      cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel,
      null_resource.wait_for_cluster
    ]
}

resource "cloudflare_zero_trust_access_application" "full" {
  account_id       = var.cloudflare_account_id
  name             = "Ragdoll EKS"
  domain           = var.cloudflare_tunnel_hostname
  type             = "self_hosted"
  session_duration = "24h"
  http_only_cookie_attribute = true
  app_launcher_visible       = true
}

resource "cloudflare_access_policy" "email_restrict" {
  application_id = cloudflare_zero_trust_access_application.full.id
  account_id     = var.cloudflare_account_id
  name           = "Allow users with appropriate email domain"
  precedence     = 1
  decision       = "allow"

  include {
    email_domain = var.cloudflare_appropriate_email
  }
}

resource "cloudflare_access_policy" "deny_all" {
  application_id = cloudflare_zero_trust_access_application.full.id
  account_id     = var.cloudflare_account_id
  name           = "Deny all"
  precedence     = 2
  decision       = "deny"

  include {
    everyone = true
  }
}
