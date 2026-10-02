module Api
  module V1
    class BriefsController < ApplicationController
      def daily
        zone = ActiveSupport::TimeZone[params[:timezone].presence || "Baghdad"] || Time.zone
        now = zone.now
        day_start = now.beginning_of_day.utc
        day_end = now.end_of_day.utc

        today = Task.open_tasks.where(due_at: day_start..day_end).order(priority: :desc, due_at: :asc)
        overdue = Task.open_tasks.where.not(due_at: nil).where("due_at < ?", day_start).order(priority: :desc, due_at: :asc)
        completed = Task.where(completed_at: day_start..day_end).order(completed_at: :desc)
        unscheduled = Task.open_tasks.where(due_at: nil).order(priority: :desc, created_at: :asc).limit(10)

        render json: {
          date: now.to_date,
          timezone: zone.tzinfo.name,
          counts: {
            today: today.size,
            overdue: overdue.size,
            completed_today: completed.size,
            unscheduled: unscheduled.size
          },
          today: today,
          overdue: overdue,
          completed_today: completed,
          unscheduled: unscheduled
        }
      end
    end
  end
end
