output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.frontend.name
}

output "ecs_task_definition_arn" {
  value = aws_ecs_task_definition.frontend.arn
}
