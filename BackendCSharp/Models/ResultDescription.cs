using Newtonsoft.Json;

namespace BackendCSharp.Models
{
    public struct ResultDescription
    {
        [JsonRequired]
        public bool Ok { get; set; }
        public string? Error { get; set; }
    }
}
