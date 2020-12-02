
const xss = require('xss')
const Treeize = require('treeize')

const HabitsService = {
  getById(db, habits_id) {
    return db
      .from('habituallygood_habits')
      .where('id', habits_id)
      .first()
  },

  getHabitsList(db, user_id) {
    return db
      .from('habituallygood_habits')
      .select(
        'id',
        'text',
        'due_date',
        'reward',
        'xp',
      )
      .where(
        'user_id', user_id
      )
      .orderBy('due_date')
  },

  insertNewHabit(db, newHabit) {
    return db
      .insert(newHabit)
      .into('habituallygood_habits')
      .returning('*')
      .then(([habits]) => habit)
      .then(habit =>
        TasksService.getById(db, habit.id)
      )
  },

  deleteHabits(db, habitsID) {
    return db
      .from('habituallygood_habits')
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
      xp: habitsData.xp,
    }
  }
}

module.exports = HabitsService