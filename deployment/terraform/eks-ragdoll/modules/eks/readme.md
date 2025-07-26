```bash
aws secretsmanager delete-secret --secret-id prod/platform --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/rabbitmq --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id prod/postgres --force-delete-without-recovery
```

```bash
aws eks update-kubeconfig --name ragdoll-eks --region us-east-1
```