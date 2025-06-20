import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('blogPosts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  async create(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @User() user: IUser,
  ) {
    return this.blogPostsService.create(createBlogPostDto, user);
  }

  @Get()
  async findAll() {
    return this.blogPostsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const post = await this.blogPostsService.findOne(id, user);
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @User() user: IUser,
  ) {
    const updated = await this.blogPostsService.update(
      id,
      updateBlogPostDto,
      user,
    );
    if (!updated) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    const deleted = await this.blogPostsService.remove(id, user);
    if (!deleted) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return deleted;
  }
}
