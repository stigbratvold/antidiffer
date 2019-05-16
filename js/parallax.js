const sections = document.querySelectorAll("section, footer")
const bodyTag = document.querySelector("body")

const addMovement = function () {
  const topViewport = window.pageYOffset
  const midViewport = topViewport + (window.innerHeight / 2)

  // lets find the middle of each section
  // (section, index) => {}
  sections.forEach((section, index) => {
    const topSection = section.offsetTop
    const midSection = topSection + (section.offsetHeight / 2)

    // how far away is the section from the visible area of the page
    const distanceToSection = midViewport - midSection

    // pick the tags to parallax
    const contentTag = section.querySelector("div")

    // weight down this distance
    let rotation = distanceToSection / -100
    let contentDist = -1 * distanceToSection / 2

    // for all the even sections, rotate the other way
    // is the index divisible by two
    // is the index's remainder zero?
    // the modulo operator 5 % 2 = 1, 4 % 2 = 0
    if (index % 2 == 1) {
      rotation = rotation * -1
    }



    contentTag.style.top = `${contentDist}px`

    // check the background
    if (distanceToSection > -600) {
      const dataBackground = section.getAttribute("data-background")
      bodyTag.style.backgroundColor = dataBackground
    }
  })
}

addMovement()

document.addEventListener("scroll", function () {
  addMovement()
})

window.addEventListener("resize", function () {
  addMovement()
})
