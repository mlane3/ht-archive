from restful import db


class Backpagecontent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer, db.ForeignKey('backpagepost.id'), unique=True)
    title = db.Column('title', db.Text(120))
    body = db.Column('body', db.Unicode)
    textsearch = db.Column('textsearch', db.String(80))


class Backpageemail(db.Model):
    backpagepostid = db.Column('backpagepostid', db.Integer, primary_key=True)
    email = db.Column('name', db.String(30))


class Backpageentities(db.Model):
    enitity_id = db.Column('enitity_id', db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer)


class Backpagephone(db.Model):
    backpagepostid = db.Column('backpagepostid', db.Integer, db.ForeignKey('backpagepost.id'), primary_key=True, )
    number = db.Column('number', db.String(20))


class Backpagepost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pageid = db.Column('pageid', db.Integer, unique=True)
    oid = db.Column('oid', db.Integer)
    posterage = db.Column('posterage', db.SmallInteger)
    postdate = db.Column('postdate', db.DateTime(timezone=True))
    phone = db.relationship('Backpagephone', backref='backpagepost', lazy='dynamic')
    content = db.relationship("Backpagecontent", backref='backpagepost', lazy='dynamic')


class Backpagesite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(120))


class Crawler(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(32))
    version = db.Column('version', db.VARCHAR)

