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
        public ActionResult<string> GetUser()
        {
            var userLogin = HttpContext.Session.GetString("UserLogin");
            var userId = HttpContext.Session.GetString("UserId");
            return JsonSerializer.Serialize(new { login=userLogin, id=userId });
        }

        [HttpPost("login")]
        public ActionResult<JObject> Login([FromBody] JObject model)
        {
            var userModel = model.ToObject<User>();
            if (userModel == null || string.IsNullOrEmpty(userModel.Login) || string.IsNullOrEmpty(userModel.Password))
                return JObject.FromObject(new { ok = false, error = "empty_data" });

            var db = new TasksContext();
            var user = db.Users.FirstOrDefault(user => user.Login == userModel.Login);

            // if a user with such a username does not exist, return an error
            if (user == null)
                return JObject.FromObject(new { ok = false, error = "incorrect_login_or_password" });

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
                return JObject.FromObject(new { ok = false, error = "incorrect_login_or_password" });

            HttpContext.Session.SetString("UserLogin", user.Login);
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            return JObject.FromObject(new { ok = true });
        }

        [HttpPost("register")]
        public ActionResult<JObject> Register([FromBody] JObject model)
        {
            var userModel = model.ToObject<User>();
            if (userModel == null || string.IsNullOrEmpty(userModel.Login) || string.IsNullOrEmpty(userModel.Password))
                return JObject.FromObject(new { ok = false, error = "empty_data" });

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
                        return JObject.FromObject(new { ok = false, error = "user_exist" });
                    else
                        return JObject.FromObject(new { ok = false, error = ex.Message });
                }
                else
                    return JObject.FromObject(new { ok = false, error = ex.Message });
            }
            return JObject.FromObject(new { ok = true });
        }

        [HttpPost("logout")]
        public ActionResult<JObject> Logout()
        {
            HttpContext.Session.Clear();
            return JObject.FromObject(new { ok = true });
        }
    }
}
