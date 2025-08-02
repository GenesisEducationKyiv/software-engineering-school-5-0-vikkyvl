resource "aws_eks_addon" "ebs_csi" {
  cluster_name             = "ragdoll-eks"
  addon_name               = "aws-ebs-csi-driver"
  service_account_role_arn = "arn:aws:iam::301235908824:role/ragdoll-ebs-csi-role"
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update   = "OVERWRITE"

  depends_on = [null_resource.wait_for_cluster]
}

resource "helm_release" "secrets_store_csi_driver" {
  name       = "secrets-store-csi-driver"
  namespace  = "kube-system"
  chart      = "./addons/secrets-store-csi-driver-1.5.3.tgz"
  version    = "1.5.3"

  create_namespace = true

  set = [
    {
      name  = "syncSecret.enabled"
      value = "true"
    },
    {
      name  = "enableSecretRotation"
      value = "true"
    }
  ]

  depends_on = [null_resource.wait_for_cluster]
}

resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  namespace  = "ingress-nginx"
  chart      = "./addons/ingress-nginx-4.13.0.tgz"
  version    = "4.13.0"
  create_namespace = true

  set = [
    {
      name  = "controller.service.type"
      value = "LoadBalancer"
    },
    {
      name  = "controller.ingressClassResource.name"
      value = "nginx"
    },
    {
      name  = "controller.ingressClassResource.default"
      value = "true"
    },
    {
      name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-internal"
      value = "true"
    }
  ]

  depends_on = [null_resource.wait_for_cluster]
}

resource "helm_release" "argocd" {
  name       = "argocd"
  namespace  = "argocd"
  chart      = "./addons/argo-cd-8.2.5.tgz"
  version    = "8.2.5"
  create_namespace = true

  values = [
    file("${path.module}/config/argocd-values-prod.yaml")
  ]

  timeout  = 300
  wait     = true
  atomic   = true
  cleanup_on_fail = true
  depends_on = [aws_eks_cluster.main, null_resource.wait_for_cluster]
}
