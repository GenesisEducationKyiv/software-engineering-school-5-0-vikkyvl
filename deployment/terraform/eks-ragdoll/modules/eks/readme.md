# How to pull Helm charts
```bash
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo add aws-secrets-manager https://aws.github.io/secrets-store-csi-driver-provider-aws
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add cloudflare https://cloudflare.github.io/helm-charts
helm repo update

helm pull argo/argo-cd --version 8.2.5 --untar=false
helm pull cloudflare/cloudflare-tunnel --version 0.3.2 --untar=false
```

# Force delete secrets in AWS Secrets Manager
```bash
aws secretsmanager delete-secret --secret-id prod/platform --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/rabbitmq --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/postgres --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/general --force-delete-without-recovery
```

```bash
aws eks update-kubeconfig --name ragdoll-eks --region us-east-1
```

```bash
terraform import module.eks.kubernetes_config_map.aws_auth kube-system/aws-auth
```

```bash
terraform output github_ci_access_key_id
terraform output github_ci_secret_access_key
```