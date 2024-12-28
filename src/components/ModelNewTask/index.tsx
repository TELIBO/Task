import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import { formatISO } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask] = useCreateTaskMutation();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: Status.ToDo,
    priority: Priority.Backlog,
    tags: "",
    startDate: "",
    dueDate: "",
    authorUserId: "1",
    assignedUserId: "1",
    projectId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: Status.ToDo,
      priority: Priority.Backlog,
      tags: "",
      startDate: "",
      dueDate: "",
      authorUserId: "",
      assignedUserId: "",
      projectId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const projectIdToUse = id !== null ? id : formData.projectId;
      
      if (!formData.title || !formData.authorUserId || !projectIdToUse) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        tags: formData.tags,
        startDate: formData.startDate 
          ? formatISO(new Date(formData.startDate))
          : undefined,
        dueDate: formData.dueDate 
          ? formatISO(new Date(formData.dueDate))
          : undefined,
        authorUserId: parseInt(formData.authorUserId),
        assignedUserId: formData.assignedUserId 
          ? parseInt(formData.assignedUserId)
          : undefined,
        projectId: parseInt(projectIdToUse),
      };

      await createTask(payload).unwrap();
      toast.success("Task created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          className={inputStyles}
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          required
        />
        
        <textarea
          name="description"
          className={inputStyles}
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            name="status"
            className={selectStyles}
            value={formData.status}
            onChange={handleChange}
          >
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            name="priority"
            className={selectStyles}
            value={formData.priority}
            onChange={handleChange}
          >
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          name="tags"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            name="startDate"
            className={inputStyles}
            value={formData.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dueDate"
            className={inputStyles}
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        
        {id === null && (
          <input
            type="text"
            name="projectId"
            className={inputStyles}
            placeholder="Project ID *"
            value={formData.projectId}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-primary px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Create Task
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;