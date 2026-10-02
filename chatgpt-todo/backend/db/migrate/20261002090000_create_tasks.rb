class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :notes
      t.string :status, null: false, default: "pending"
      t.integer :priority, null: false, default: 3
      t.datetime :due_at
      t.datetime :remind_at
      t.datetime :completed_at
      t.string :recurrence
      t.string :source, null: false, default: "dashboard"
      t.string :created_by
      t.string :timezone, null: false, default: "Asia/Baghdad"
      t.timestamps
    end

    add_index :tasks, :status
    add_index :tasks, :due_at
    add_index :tasks, :remind_at
    add_index :tasks, :completed_at
  end
end
