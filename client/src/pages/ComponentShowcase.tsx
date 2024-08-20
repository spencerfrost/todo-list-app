import MainLayout from 'components/layouts/MainLayout';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'components/ui/card';
import { Checkbox } from 'components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { useToast } from 'components/ui/use-toast';
import React from 'react';

const ComponentShowcase: React.FC = () => {
  const { toast } = useToast();

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold">Component Showcase</h1>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-2">
            <div className="space-x-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="space-x-2">
              <Button size="default">Default Size</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🚀</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Card</h2>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Checkbox</h2>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms">Accept terms and conditions</label>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description.
                </DialogDescription>
              </DialogHeader>
              <p>Dialog content goes here.</p>
            </DialogContent>
          </Dialog>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Input</h2>
          <Input type="text" placeholder="Type something..." />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Select</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Switch</h2>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <label htmlFor="airplane-mode">Airplane Mode</label>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Toast</h2>
          <Button
            onClick={() => {
              toast({
                title: "Toast Notification",
                description: "This is a toast message.",
              })
            }}
          >
            Show Toast
          </Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default ComponentShowcase;