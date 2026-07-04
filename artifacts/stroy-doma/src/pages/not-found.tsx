import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-serif text-7xl font-medium text-primary mb-4">404</div>
        <h1 className="font-serif text-2xl md:text-3xl font-medium mb-3">
          Страница не найдена
        </h1>
        <p className="text-muted-foreground mb-8">
          Похоже, такой страницы не существует или она была перемещена.
          Вернитесь на главную или посмотрите наши проекты.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild className="rounded-full px-6">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" /> На главную
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/projects">Смотреть проекты</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
