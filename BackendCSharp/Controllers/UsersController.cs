using Microsoft.AspNetCore.Mvc;
using BackendCSharp.Models;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace BackendCSharp.Controllers
{
    [Route("api/users/")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        [HttpGet("get-user-info")]
        public ActionResult<User> GetUser()
        {
            var userString = HttpContext.Session.GetString("User");
            if (string.IsNullOrEmpty(userString))
                return new User() { Id = null };
            else
                return JObject.Parse(userString).ToObject<User>();
        }

        [HttpPost("login")]
        public ActionResult<ResultDescription> Login([FromBody] User userModel)
        {
            if (userModel == null || string.IsNullOrEmpty(userModel.Login) || string.IsNullOrEmpty(userModel.Password))
                return new ResultDescription() { Ok = false, Error = "empty_data" };

            var db = new TasksContext();
            var user = db.Users.FirstOrDefault(user => user.Login == userModel.Login);

            // if a user with such a username does not exist, return an error
            if (user == null)
                return new ResultDescription() { Ok = false, Error = "incorrect_login_or_password" };

            // if the user is found, check the passwords
            // add salt and parse to byte array
            var fullPassword = Encoding.UTF8.GetBytes(userModel.Password + user.Salt);
            // encrypt the full password and then translate to hexadecimal
            var encryptedPassword = string
                .Join("", SHA512.Create()
                                .ComputeHash(fullPassword)
                                .Select(one_byte => string.Format("{0:X2}",one_byte)))
                .ToLower();

            // compare passwords
            // if the passwords match, return success
            if (encryptedPassword != user.Password)
                return new ResultDescription { Ok = false, Error = "incorrect_login_or_password" };

            HttpContext.Session.SetString("User", JObject.FromObject(new User { Id = user.Id, Login = user.Login }).ToString());
            return new ResultDescription { Ok = true };
        }

        [HttpPost("register")]
        public ActionResult<ResultDescription> Register([FromBody] User userModel)
        {
            if (userModel == null || string.IsNullOrEmpty(userModel.Login) || string.IsNullOrEmpty(userModel.Password))
                return new ResultDescription() { Ok = false, Error = "empty_data" };

            const string allSaltSymbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&\\'()*+,-./:;<=>?@[\\\\]^_`{|}~";
            var random = new Random();
            var salt = string.Empty;
            for (int i = 0; i < 10; i++)
            {
                var position = random.Next(0, allSaltSymbols.Length);
                salt += allSaltSymbols[position];
            }
            var fullPassword = userModel.Password + salt;
            var encryptedPassword = string
                                        .Join("", SHA512.Create()
                                                        .ComputeHash(Encoding.UTF8.GetBytes(fullPassword))
                                                        .Select(symbol => string.Format("{0:X2}", symbol)))
                                        .ToLower();

            var db = new TasksContext();
            db.Users.Add(new User { Login = userModel.Login, Password = encryptedPassword, Salt = salt });
            try
            {
                db.SaveChanges();
            }
            catch(DbUpdateException ex)
            {
                var inner_ex = ex.InnerException;
                if (inner_ex != null && inner_ex is SqliteException @sqliteException)
                {
                    if (sqliteException.SqliteErrorCode == 19)
                        return new ResultDescription() { Ok = false, Error = "user_exist" };
                    else
                        return new ResultDescription() { Ok = false, Error = ex.Message };
                }
                else
                    return new ResultDescription() { Ok = false, Error = ex.Message };
            }
            return new ResultDescription()  { Ok = true };
        }

        [HttpPost("logout")]
        public ActionResult<JObject> Logout()
        {
            HttpContext.Session.Clear();
            return JObject.FromObject(new { ok = true });
        }
    }
}
