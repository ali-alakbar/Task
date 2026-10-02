module Api
  module V1
    class TasksController < ApplicationController
      before_action :set_task, only: %i[show update destroy complete]

      def index
        tasks = Task.order(Arel.sql("CASE WHEN status = 'done' THEN 1 ELSE 0 END"), :due_at, priority: :desc, created_at: :desc)
        tasks = tasks.where(status: params[:status]) if params[:status].present?
        tasks = tasks.where("due_at >= ?", Time.zone.parse(params[:from])) if params[:from].present?
        tasks = tasks.where("due_at <= ?", Time.zone.parse(params[:to])) if params[:to].present?
        render json: tasks
      end

      def show
        render json: @task
      end

      def create
        task = Task.create!(task_params)
        render json: task, status: :created
      end

      def update
        @task.update!(task_params)
        @task.update!(completed_at: Time.current) if @task.status == "done" && @task.completed_at.nil?
        @task.update!(completed_at: nil) if @task.status != "done" && @task.completed_at.present?
        render json: @task
      end

      def destroy
        @task.destroy!
        head :no_content
      end

      def complete
        @task.complete!
        render json: @task
      end

      private

      def set_task
        @task = Task.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :notes, :status, :priority, :due_at, :remind_at, :recurrence, :source, :created_by, :timezone)
      end
    end
  end
end
