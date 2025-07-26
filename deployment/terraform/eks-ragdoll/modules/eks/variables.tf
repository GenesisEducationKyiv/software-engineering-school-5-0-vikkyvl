variable "cluster_version" {
  default = "1.33"
}

variable "public_access_cidrs" {
  description = "List of CIDRs allowed to access EKS API (e.g. ['1.2.3.4/32', '5.6.7.8/32'])"
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to the ECR repositories"
  type        = map(string)
  default     = {}
}

variable "desired_capacity" {
  default = 2
}

variable "max_size" {
  default = 3
}

variable "min_size" {
  default = 1
}

variable "instance_type" {
  default = "t3.small"
}

variable "capacity_type" {
  default = "SPOT"
}

variable "disk_size" {
  default = 20
}

variable "ami_type" {
  default = "AL2023_x86_64_STANDARD"
}

variable "instance_release_version" {
  default = "1.33.0-20250715"
}
