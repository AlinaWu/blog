var mongodb = require('./db');
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}
module.exports = User;

//save user information
User.prototype.save = function(callback){

    //user document for insert database
    var user = {
        name : this.name,
        password : this.password,
        email : this.email
    }

    //open mongodb
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        //read users collection
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //user information insert into users collection
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user['ops'][0]);//success,error is null and return the stored user information
            });
        })
    })
};

//get user information by name
User.get = function(name,callback){
    //open database
    mongodb.open(function(err,db){

        if(err){
            return callback(err);
        }

        //read users collection
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //find user information that the user 'name' is name
            collection.findOne({name:name},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user);
            })
        })
    });
};