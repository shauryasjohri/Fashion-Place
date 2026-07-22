import Category from "@/components/product/Category"

export default function CategoryList({ categories }) {
	return (
		<div className="flex flex-wrap justify-center items-center">
			{categories.map(category => (
				<Category 
					key={category.id}
					imgSrc={category.image}
					title={category.title}
					link="#"
				/>
			))}
		</div>
	)
}