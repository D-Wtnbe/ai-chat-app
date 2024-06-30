variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs"
}

variable "frontend_target_group_arn" {
  type        = string
  description = "ARN of the frontend target group"
}

variable "backend_target_group_arn" {
  type        = string
  description = "ARN of the backend target group"
}

variable "ecs_task_execution_role_arn" {
  type        = string
  description = "ARN of the ECS task execution role"
}

variable "frontend_repository_url" {
  type        = string
  description = "URL of the frontend ECR repository"
}

variable "alb_dns_name" {
  type        = string
  description = "DNS name of the ALB"
}

variable "alb_sg" {
  type        = string
  description = "ID of the ALB security group"
}
