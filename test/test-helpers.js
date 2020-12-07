const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUser() {
  return {
    id: 1,
    username: 'testUser-1',
    first_name: 'test1',
    password: 'Pa$$w0rd',
    level: 1,
    points: 100,
    points_to_next_level: 500,
    date_joined: '2020-01-01'
  }
}

function makeHabitsArray(user) {
  return [
    {
      id: 1,
      text: 'First Habit to do...',
      due_date: '2020-01-01',
      reward: 'first test reward',
      points: 10,
      user_id: user.id
    },
    {
      id: 2,
      text: 'Second Habit to do...',
      due_date: '2020-02-01',
      reward: 'second test reward',
      points: 25,
      user_id: user.id
    },
    {
      id: 3,
      text: 'Third Habit to do...',
      due_date: '2020-03-01',
      reward: 'third test reward',
      points: 50,
      user_id: user.id
    },
    {
      id: 4,
      text: 'Fourth Habit to do...',
      due_date: '2020-04-01',
      reward: 'fourth test reward',
      points: 75,
      user_id: user.id
    },
    {
      id: 5,
      text: 'Fifth Habit to do...',
      due_date: '2020-11-01',
      reward: 'fifth test reward',
      points: 100,
      user_id: user.id
    }
  ]
}

function makeRewardsArray(user) {
  return [
    {
      id: 1,
      reward: 'Test Reward 1',
      user_id: user.id
    },
    {
      id: 2,
      reward: 'Test Reward 2',
      user_id: user.id
    },
    {
      id: 3,
      reward: 'Test Reward 3',
      user_id: user.id
    }
  ]
}

function makeExpectedHabits(habits) {
  return {
    id: habits.id,
    text: habits.text,
    due_date: habits.due_date + 'T00:00:00.000Z',
    reward: habits.reward,
    points: habits.points.toString()
  }
}

function makeExpectedReward(reward, user) {
  return {
    id: reward.id,
    reward: reward.reward,
    user_id: Number(user.id)
  }
}

function makeMaliciousHabits(user) {
  const maliciousHabits = {
    id: 1,
    text: 'Naughty naughty very naughty <script>alert("xss");</script>',
    due_date: '2020-12-01',
    reward:
      'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    points: 100,
    user_id: user.id
  }

  const expectedHabits = {
    ...makeExpectedHabits(maliciousHabits),
    text: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    reward: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }

  return {
    maliciousHabits,
    expectedHabits
  }
}

function makeMaliciousReward(user) {
  const maliciousReward = {
    id: 1,
    reward: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: Number(user.id)
  }

  const expectedReward = {
    ...makeExpectedReward(maliciousReward, user),
    reward: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  }

  return {
    maliciousReward,
    expectedReward
  }
}

function seedUser(db, user) {
  const preppedUser = {
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }

  return db
    .into('habitually_users')
    .insert(preppedUser)
    .then(() =>
      db.raw(`SELECT setval('habitually_users_id_seq', ?)`, [user.id])
    )
}

function seedHabits(db, user, habits) {
  return db.transaction(async trx => {
    await seedUser(trx, user)
    await trx.into('habitually_habits').insert(habits)

    await trx.raw(`SELECT setval('habitually_habits_id_seq', ?)`, [
      habits[habits.length - 1].id
    ])
  })
}

function seedRewards(db, user, rewards) {
  return db.transaction(async trx => {
    await seedUser(trx, user)
    await trx.into('habitually_rewards').insert(rewards)

    await trx.raw(`SELECT setval('habitually_rewards_id_seq', ?)`, [
      rewards[rewards.length - 1].id
    ])
  })
}

function seedMaliciousHabits(db, user, habits) {
  return seedUser(db, user).then(() =>
    db.into('habitually_habits').insert([habits])
  )
}

function seedMaliciousReward(db, user, reward) {
  return seedUser(db, user).then(() =>
    db.into('habitually_rewards').insert([reward])
  )
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      habitually_users,
      habitually_habits,
      habitually_rewards
      RESTART IDENTITY CASCADE;`
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })

  return `Bearer ${token}`
}

module.exports = {
  makeUser,
  makeHabitsArray,
  makeRewardsArray,
  makeExpectedHabits,
  makeExpectedReward,
  makeMaliciousHabits,
  makeMaliciousReward,
  seedUser,
  seedHabits,
  seedRewards,
  seedMaliciousHabits,
  seedMaliciousReward,
  cleanTables,
  makeAuthHeader
}