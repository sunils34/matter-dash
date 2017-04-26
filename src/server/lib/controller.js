import db from '../database/mysql/models';

export default {
  create: async (req, res) => {
    if (req.route.methods.get) {
      return res.render('pages/create.ejs');
    }

    const { company_name, subdomain } = req.body;
    if (await db.Organization.findOne({ where: { subdomain } })) {
      req.flash('error', 'This org subdomain is already taken');
      return req.session.save(() => {
        res.redirect('/signup');
      });
    }

    const org = await db.Organization.create({
      name: company_name,
      subdomain,
    });
    await req.user.setOrganization(org);
    return res.redirect('/');
  },
};
