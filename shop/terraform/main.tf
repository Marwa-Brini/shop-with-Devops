provider "aws" {
  region = var.region
}

# Security group - allow HTTP and SSH
resource "aws_security_group" "shop_sg" {
  name        = "shop-sg"
  description = "Allow HTTP and SSH for shop app"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "App Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "shop-sg"
  }
}

# EC2 Instance
resource "aws_instance" "shop_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.shop_sg.id]

  tags = {
    Name        = "shop-server"
    Environment = var.environment
    Project     = "basic-shop"
  }

  # Write the public IP to a local file for Ansible to use
  provisioner "local-exec" {
    command = "echo '[web]\n${self.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${var.key_path}' > ../ansible/inventory/hosts.ini"
  }
}
