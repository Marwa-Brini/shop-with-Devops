output "server_public_ip" {
  description = "Public IP of the shop server"
  value       = aws_instance.shop_server.public_ip
}

output "shop_url" {
  description = "URL to access the shop"
  value       = "http://${aws_instance.shop_server.public_ip}:3000"
}
