import Task from "../models/Task.js";

const createTask = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      deadline,
      estimatedHours,
      difficulty,
      priority,
      status,
    } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({
        message: "Title, subject, and deadline are required",
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      subject,
      description,
      deadline,
      estimatedHours,
      difficulty,
      priority,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, subject, priority, search, sortBy, order } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortField = sortBy || "deadline";
    const sortOrder = order === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      subject,
      description,
      deadline,
      estimatedHours,
      difficulty,
      priority,
      status,
    } = req.body;

    task.title = title ?? task.title;
    task.subject = subject ?? task.subject;
    task.description = description ?? task.description;
    task.deadline = deadline ?? task.deadline;
    task.estimatedHours = estimatedHours ?? task.estimatedHours;
    task.difficulty = difficulty ?? task.difficulty;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };