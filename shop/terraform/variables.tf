variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "ami_id" {
  description = "Ubuntu 22.04 AMI ID (update per region)"
  default     = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 us-east-1
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"  # free tier eligible
}

variable "key_name" {
  description = "Name of your AWS key pair"
  type        = string
}

variable "key_path" {
  description = "Local path to your private key (.pem)"
  type        = string
  default     = "~/.ssh/id_rsa"
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}
