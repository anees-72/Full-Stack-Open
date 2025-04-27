const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = ({course}) => {
    return(
      <h2>{course.name}</h2>
    )
  }
  
  const Content = ({parts}) => {
    return(
      <div>
        {parts.map(part=>
          <p>{part.name}  {part.exercises}</p>
        )}
        </div>
    )
  }
  
  const Total = ({parts}) => {
    const total = parts.reduce((sum,part) => sum +part.exercises, 0)
    return(
      <h3>Number of exercises {total}</h3>
    )
  }
  
  export default Course