import { AuthRequest } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Resume from '../models/Resume';

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { resumeId, content } = req.body;
  const commenterId = req.userId;

  if (!commenterId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const comment = await Comment.create({
      resumeId,
      commenterId,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCommentsByResume = async (req: Request, res: Response): Promise<void> => {
  const { resumeId } = req.params;

  try {
    const comments = await Comment.find({ resumeId }).populate('commenterId', 'username');
    if (!comments || comments.length === 0) {
      res.status(404).json({ message: 'No comments found for this resume' });
      return;
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
