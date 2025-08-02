output "cluster_name" {
  value = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "cluster_ca_certificate" {
  value = aws_eks_cluster.main.certificate_authority[0].data
}

output "node_role_arn" {
  value = aws_iam_role.eks_node_role.arn
}

output "cloudflared_tunnel_info" {
  value = var.cloudflare_enable_tunnel ? {
    tunnel_id   = cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel[0].id
    tunnel_name = cloudflare_zero_trust_tunnel_cloudflared.eks_tunnel[0].name
    hostname    = var.cloudflare_tunnel_hostname
  } : null
}

output "cloudflare_tunnel_hostname" {
  value = var.cloudflare_tunnel_hostname
}
