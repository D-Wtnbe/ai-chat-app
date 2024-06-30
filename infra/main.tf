module "network" {
  source       = "./modules/network"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "alb" {
  source            = "./modules/alb"
  project_name      = var.project_name
  vpc_id            = module.network.vpc_id
  public_subnet_ids = module.network.public_subnet_ids
}

module "ecs" {
  source                      = "./modules/ecs"
  project_name                = var.project_name
  vpc_id                      = module.network.vpc_id
  private_subnet_ids          = module.network.private_subnet_ids
  frontend_target_group_arn   = module.alb.frontend_target_group_arn
  backend_target_group_arn    = module.alb.backend_target_group_arn
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  frontend_repository_url     = module.ecr.frontend_repository_url
  alb_dns_name                = module.alb.alb_dns_name
  alb_sg                      = module.alb.alb_sg
}
