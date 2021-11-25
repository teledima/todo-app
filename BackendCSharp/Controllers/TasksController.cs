using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using BackendCSharp.Models;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;
using Controller = Microsoft.AspNetCore.Mvc.Controller;
using System.Web.Mvc;
using Microsoft.EntityFrameworkCore;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

namespace BackendCSharp.Controllers
{

    [Route("api/tasks/")]
    [ApiController]
    public class TasksController : Controller
    {
        public User? UserSession { 
            get 
            {
                var userString = HttpContext.Session.GetString("User");
                if (string.IsNullOrEmpty(userString))
                    return null;
                return JObject.Parse(HttpContext.Session.GetString("User") ?? "").ToObject<User>();
            } 
        }
        public bool IsAuthorized { 
            get
            {
                return UserSession != null && UserSession.Id != null && !string.IsNullOrEmpty(UserSession.Login);
            } 
        }

        [HttpGet("get-tasks")]
        public ActionResult<IEnumerable<Models.Task>> GetTasks([System.Web.Http.FromUri] bool Checked)
        {
            if (!IsAuthorized)
            {
                return StatusCode((int)System.Net.HttpStatusCode.Forbidden, null);
            }
            using var db = new TasksContext();
            var user = db.Users.Include(user => user.Tasks).SingleOrDefault(user => UserSession != null && user.Id == UserSession.Id);
            if (user != null && user.Tasks != null)
                return user.Tasks.Where(task => task.Checked == (Checked ? 1 : 0)).ToList();
            else
                return new List<Models.Task>() { };
        }

        [HttpGet("get-full-info/{taskId}")]
        public ActionResult<Models.Task> GetTaskInfo(int taskId)
        {
            if (!IsAuthorized)
            {
                return StatusCode((int)System.Net.HttpStatusCode.Forbidden, null);
            }
            using var db = new TasksContext();
            var user = db.Users.Include(user => user.Tasks).SingleOrDefault(user => UserSession != null && user.Id == UserSession.Id);
            if (user != null && user.Tasks != null)
                return user.Tasks.Where(task => task.Id == taskId).FirstOrDefault();
            else
                return StatusCode((int)System.Net.HttpStatusCode.NotFound, null);
        }

        [HttpPost("create-task")]
        public ActionResult<JObject> CreateTask([FromBody] Models.Task taskModel)
        {
            if (!IsAuthorized)
            {
                return StatusCode((int)System.Net.HttpStatusCode.Forbidden, null);
            }
            
            using var db = new TasksContext();
            taskModel.Checked = 0;
            taskModel.User = db.Users.FirstOrDefault(user => UserSession != null && user.Id == UserSession.Id);
            db.Tasks.Add(taskModel);
            db.SaveChanges();
            return JObject.FromObject(new { ok = true, id = taskModel.Id });
        }


        [HttpPost("delete-task")]
        public ActionResult<ResultDescription> DeleteTask([FromBody] JObject model)
        {
            var taskModel = model.ToObject<Models.Task>();
            if (!IsAuthorized)
            {
                return StatusCode((int)System.Net.HttpStatusCode.Forbidden, null);
            }

            using var db = new TasksContext();
            var task = db.Users
                         .Include(user => user.Tasks)
                         .SingleOrDefault(user => UserSession != null && user.Id == UserSession.Id)
                         ?.Tasks
                         .Where(task => task.Id == taskModel.Id)
                         .FirstOrDefault();
            if (task != null)
            {
                db.Tasks.Remove(task);
                db.SaveChanges();
                return new ResultDescription() { Ok = true };
            }
            else
                return StatusCode((int)System.Net.HttpStatusCode.NotFound, null);
        }

        [HttpPost("update-task")]
        public ActionResult<ResultDescription> UpdateTask([FromBody] JObject model)
        {
            var taskModel = model.ToObject<Models.Task>();
            if (!IsAuthorized)
            {
                return StatusCode((int)System.Net.HttpStatusCode.Forbidden, null);
            }
            using var db = new TasksContext();
            var task = db.Users
                         .Include(user => user.Tasks)
                         .SingleOrDefault(user => UserSession != null && user.Id == UserSession.Id)
                         ?.Tasks
                         .Where(task => task.Id == taskModel.Id)
                         .FirstOrDefault();

            if (!string.IsNullOrEmpty(taskModel.Title))
            {
                task.Title = taskModel.Title;
            }
            if (taskModel.Description != null)
            {
                task.Description = taskModel.Description;
            }
            if (taskModel.Checked != null)
            {
                task.Checked = taskModel.Checked;
            }
            db.Update(task);
            db.SaveChanges();
            return new ResultDescription() { Ok = true };
        }
    }
}
