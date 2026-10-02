class Task < ApplicationRecord
  STATUSES = %w[pending in_progress done].freeze
  PRIORITIES = 1..5

  validates :title, presence: true, length: { maximum: 180 }
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }

  scope :open_tasks, -> { where.not(status: "done") }
  scope :due_before, ->(time) { where.not(due_at: nil).where("due_at < ?", time) }

  before_validation :apply_defaults

  def complete!
    update!(status: "done", completed_at: Time.current)
  end

  private

  def apply_defaults
    self.status ||= "pending"
    self.priority ||= 3
    self.source ||= "dashboard"
    self.timezone ||= "Asia/Baghdad"
  end
end
