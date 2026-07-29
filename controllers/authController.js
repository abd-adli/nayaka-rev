const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'ADMIN' ? '/admin/dashboard' : '/');
  }
  res.render('pages/login', { title: 'Login', error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.render('pages/login', { title: 'Login', error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('pages/login', { title: 'Login', error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (user.role === 'ADMIN') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.render('pages/login', { title: 'Login', error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
