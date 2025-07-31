```bash
aws secretsmanager delete-secret --secret-id prod/platform --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/rabbitmq --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/postgres --force-delete-without-recovery
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