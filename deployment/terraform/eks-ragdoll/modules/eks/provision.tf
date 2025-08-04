resource "null_resource" "install_aws_provider" {
  provisioner "local-exec" {
    command = "kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml"
  }

  depends_on = [
    helm_release.secrets_store_csi_driver
  ]
}

resource "null_resource" "update_kubeconfig" {
  provisioner "local-exec" {
    command = "aws eks update-kubeconfig --name ragdoll-eks --region us-east-1"

    depends_on = [
      aws_eks_cluster.main,
      aws_eks_node_group.default,
    ]
  }
}

resource "null_resource" "wait_for_cluster" {
  provisioner "local-exec" {
    command = <<EOT
      for i in {1..20}; do
        echo "Waiting for EKS cluster to become available..." && \
        kubectl get --raw=/healthz && echo "Cluster is ready." && exit 0 || sleep 10
      done
      echo "Cluster not reachable after waiting. Exiting."
      exit 1
    EOT
  }

  depends_on = [
    null_resource.update_kubeconfig
  ]
}
