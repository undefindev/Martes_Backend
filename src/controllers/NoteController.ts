import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    console.log(req.body)
    const { content } = req.body

    const note = new Note()
    note.content = content
    note.createdBy = req.user.id
    note.task = req.task.id

    req.task.note.push(note.id)
    try {
      await Promise.allSettled([req.task.save(), note.save()])
      res.send('Nota Creada')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  // obtener las notas
  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id })
      res.json(notes)
    } catch (error) {
      res.status(500).json({ error: 'Hubo un Error' })
    }
  }
}