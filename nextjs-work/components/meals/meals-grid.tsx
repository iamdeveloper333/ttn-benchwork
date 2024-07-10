import MealItem from "./meal-item";
import classes from "./meals-grid.module.css";

interface MealsGridProps {
  meals: any;
}

export default function MealsGrid({ meals }: MealsGridProps) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal: any) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
