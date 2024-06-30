resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([{
    name  = "frontend"
    image = "${var.frontend_repository_url}:latest"

    environment = [
      {
        name  = "VITE_VOICEVOX_URL"
        value = var.alb_dns_name
      }
    ]

    portMappings = [{
      containerPort = 5173
      hostPort      = 5173
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.project_name}-frontend"
        awslogs-region        = "ap-northeast-1"
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.project_name}-frontend"
  retention_in_days = 30
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = var.private_subnet_ids
    assign_public_ip = false
    security_groups  = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 5173
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-ecs-tasks-sg"
  description = "Allow inbound access from the ALB only"
  vpc_id      = var.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 5173
    to_port     = 5173
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port       = 50021
    to_port         = 50021
    protocol        = "tcp"
    security_groups = [var.alb_sg]
  }
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = var.private_subnet_ids
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "voicevox_engine"
    container_port   = 50021
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "voicevox_engine"
      image = "voicevox/voicevox_engine:cpu-latest"
      portMappings = [
        {
          containerPort = 50021
          hostPort      = 50021
        }
      ]
      essential = true
      environment = [
        {
          name  = "ALLOWED_HOSTS"
          value = "*"
        },
        {
          name  = "CORS_ORIGINS"
          value = var.alb_dns_name
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}-backend"
          awslogs-region        = "ap-northeast-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}-backend"
  retention_in_days = 30
}
