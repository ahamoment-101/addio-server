const systemprompt = require('./systemPrompt');

const mainPrompt = [
  { role: "system", content: systemprompt},
  // 先看看直接在提示词里写效果怎么样，在决定用以下案例方式
  // {
  //   role: "system",
  //   name:"example_user",
  //   content:"I need to completed the annual product planning for next year before next Monday."
  // },
  // {
  //   role: "system",
  //   name:"example_assistant",
  //   content:`"{
  //     "任务概括": "Complete the annual product planning for next year before next Monday",
  //     "任务拆解": [
  //       "Analyze this year's product sales data and market feedback",
  //       "Research jewelry design trends and market demand for next year",
  //       "Determine the product design theme and style for the next year",
  //       "Make product series planning for each quarter",
  //       "Draw product design sketches and models",
  //       "Consult with production team on process and material feasibility",
  //       "Prepare next year's product launch schedule",
  //       "Complete product planning documents have been prepared",
  //       "Submit the product plan to relevant departments for review before next Monday"
  //     ]
  //   }"`
  // }
]
module.exports = mainPrompt