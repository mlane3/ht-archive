from restful import db


class Backpagecontent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer, unique=True)
    title = db.Column('title', db.Text(120))
    body = db.Column('body', db.Unicode)
    textsearch = db.Column('textsearch', db.String(80))
    # phone = db.relationship('Backpagephone', backref='backpagecontent', lazy='dynamic')


class Backpageemail(db.Model):
    backpagepostid = db.Column('backpagepostid', db.Integer, primary_key=True)
    email = db.Column('name', db.String(30))


class Backpageentities(db.Model):
    enitity_id = db.Column('enitity_id', db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer)


class Backpagephone(db.Model):
    backpagepostid = db.Column('backpagepostid', db.Integer, primary_key=True)
    number = db.Column('number', db.String(20))
    # post_id = db.Column(db.Integer, db.ForeignKey('Backpagecontent.backpagepostid'))


class Backpagepost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pageid = db.Column('pageid', db.Integer, unique=True)
    oid = db.Column('oid', db.Integer)
    posterage = db.Column('posterage', db.SmallInteger)
    postdate = db.Column('postdate', db.DateTime(timezone=True))
    backpagesiteid = db.Column('backpagesiteid', db.Integer)


class Backpagesite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(120))


class Crawler(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(32))
    version = db.Column('version', db.VARCHAR)

