const xss = require('xss')
const Treeize = require('treeize')

const HabitsService = {
  getById(db, habits_id) {
    return db
      .from('habitually_habits')
      .where('id', habits_id)
      .first()
  },

  getUserHabits(db, user_id) {
    return db
      .from('habitually_habits')
      .select(
        'id',
        'text',
        'due_date',
        'reward',
        'points',
      )
      .where(
        'user_id', user_id
      )
      .orderBy('due_date')
  },

  insertNewHabits(db, newHabits) {
    return db
      .insert(newHabits)
      .into('habitually_habits')
      .returning('*')
      .then(([habits]) => habits)
      .then(habits =>
        HabitsService.getById(db, habits.id)
      )
  },

  deleteHabits(db, habitsID) {
    return db
      .from('habitually_habits')
      .where('id', habitsID)
      .delete()
  },

  serializeHabits(habits) {
    return habits.map(this.serializeHabits)
  },

  serializeHabits(habits) {
    const habitsTree = new Treeize()

    
    const habitsData = habitsTree.grow([ habits ]).getData()[0]

    return {
      id: habitsData.id,
      text: xss(habitsData.text),
      due_date: habitsData.due_date,
      reward: xss(habitsData.reward),
      points: habitsData.points,
    }
  }
}

module.exports = HabitsService