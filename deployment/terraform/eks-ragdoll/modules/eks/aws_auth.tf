resource "kubernetes_config_map" "aws_auth" {
  metadata {
    name      = "aws-auth"
    namespace = "kube-system"
  }

  data = {
    mapRoles = yamlencode([
      {
        rolearn  = "arn:aws:iam::301235908824:role/ragdoll-eks-node-role"
        username = "system:node:{{EC2PrivateDNSName}}"
        groups   = [
          "system:bootstrappers",
          "system:nodes"
        ]
      }
    ])

    mapUsers = yamlencode([
      {
        userarn  = "arn:aws:iam::301235908824:user/Valmark"
        username = "Valmark"
        groups   = [
          "system:masters"
        ]
      }
    ])
  }

  depends_on = [aws_eks_cluster.main]
}