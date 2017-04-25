import db from '../database/mysql/models';

export default {
  signup: async (req, res) => {
    if (req.route.methods.get) {
      res.render('pages/signup.ejs');
    } else {
      const { company_name, subdomain } = req.body;
      const org = await db.Organization.create({
        name: company_name,
        subdomain,
      });
      await req.user.setOrganization(org);
      res.redirect('/');
    }
  },
};
